import { generateMasterSlice } from "../masterState";

const statusProject = generateMasterSlice("statusProject");

export const statusProjectActions = statusProject.actions;

export default statusProject.reducer;
