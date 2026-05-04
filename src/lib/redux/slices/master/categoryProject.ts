import { generateMasterSlice } from "../masterState";

const categoryProject = generateMasterSlice("categoryProject");

export const categoryProjectActions = categoryProject.actions;

export default categoryProject.reducer;
