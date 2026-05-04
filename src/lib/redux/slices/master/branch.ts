import { generateMasterSlice } from "../masterState";

const branch = generateMasterSlice("branch");

export const branchActions = branch.actions;

export default branch.reducer;
