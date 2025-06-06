import React from "react";
import { ModsData } from "src/types";
import ModCard from "../mod-card/ModCard";
import "./ModsGrid.css";

interface ModsGridProps {
	modsData: ModsData;
	uninstall: (modName: string) => any;
}

export default function ModsGrid({ modsData, uninstall }: ModsGridProps) {
	return (
		<div id="mods-container" className="mods-container">
			{modsData && modsData.size ? (
				Array.from(modsData.entries()).map(([id, mod]) => {
					return (
						<div key={id} className="mod-item">
							<ModCard name={mod.name} modType={mod.type} installDate={mod.installDate} uninstall={uninstall} />
						</div>
					);
				})
			) : (
				<h2 className="mods-grid-heading">No mods installed.</h2>
			)}
		</div>
	);
}
