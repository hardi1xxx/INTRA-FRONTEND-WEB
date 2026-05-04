import { generateMasterSlice } from "../masterState";

const transactionDeployment = generateMasterSlice("transactionDeployment");

export const transactionDeploymentActions = transactionDeployment.actions;

export default transactionDeployment.reducer;
