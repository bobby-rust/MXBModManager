import React, { useMemo, useState } from "react";
import {
	useReactTable,
	ColumnDef,
	FilterFn,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	flexRender,
} from "@tanstack/react-table";
import "./LeaderboardTable.css";

export interface LapTime {
	username: string;
	mapName: string;
	lapTime: number; // in seconds
	bike: string;
	bikeCategory: string;
	fileUrl: string;
}

interface Props {
	data: LapTime[];
}

export default function LeaderboardTable({ data }: Props) {
	console.log("Leaderboard data: ", data);
	if (!data) return <h1>No ghosts</h1>;

	async function installGhost(row: any) {
		console.log("Installing ghost: ", row);
		await window.modManagerAPI.installGhost(row);
		alert("Successfully installed ghost");
	}

	// 1) State for filters
	const [globalFilter, setGlobalFilter] = useState({ username: "", mapName: "" });

	// 2) Custom global filter fn
	const multiSearchFilterFn = useMemo<FilterFn<LapTime>>(
		() => (row, _columnId, filterValue) => {
			const { username: uFilter, mapName: mFilter } = filterValue as typeof globalFilter;
			const uname = row.getValue<string>("username")?.toLowerCase() || "";
			const mname = row.getValue<string>("mapName")?.toLowerCase() || "";
			return uname.includes(uFilter.toLowerCase()) && mname.includes(mFilter.toLowerCase());
		},
		[]
	);

	// 3) Column definitions, with a new "Install" column at the end
	const columns = useMemo<ColumnDef<LapTime>[]>(
		() => [
			{ accessorKey: "username", header: "User" },
			{ accessorKey: "mapName", header: "Map" },
			{
				accessorKey: "lapTime",
				header: "Lap Time (s)",
				cell: (info) => `${info.getValue()}s`,
				sortingFn: "basic",
			},
			{ accessorKey: "bike", header: "Bike" },
			{
				id: "install",
				header: "Install",
				cell: ({ row }) => (
					<button
						className="install-btn"
						onClick={() => {
							installGhost(row.original);
						}}
					>
						Install
					</button>
				),
			},
		],
		[]
	);

	// 4) Build the table instance
	const table = useReactTable({
		data,
		columns,
		state: { globalFilter },
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: multiSearchFilterFn,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div>
			{/* Toolbar */}
			<div className="table-toolbar">
				<input
					className="search-input"
					placeholder="Search username…"
					value={globalFilter.username}
					onChange={(e) => setGlobalFilter({ ...globalFilter, username: e.target.value })}
				/>
				<input
					className="search-input"
					placeholder="Search map…"
					value={globalFilter.mapName}
					onChange={(e) => setGlobalFilter({ ...globalFilter, mapName: e.target.value })}
				/>
			</div>

			{/* Table */}
			<table className="leaderboard-table">
				<thead>
					{table.getHeaderGroups().map((hg) => (
						<tr key={hg.id}>
							{hg.headers.map((header) => (
								<th key={header.id} onClick={header.column.getToggleSortingHandler()}>
									{flexRender(header.column.columnDef.header, header.getContext())}
									{{
										asc: " 🔼",
										desc: " 🔽",
									}[header.column.getIsSorted() as string] ?? null}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
