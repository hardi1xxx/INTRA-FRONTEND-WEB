import { generateMasterSlice } from "../masterState";

const reportDeployment = generateMasterSlice("reportDeployment");

export const reportDeploymentActions = reportDeployment.actions;

export default reportDeployment.reducer;
