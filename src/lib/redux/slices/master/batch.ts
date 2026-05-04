import { generateMasterSlice } from "../masterState";

const batch = generateMasterSlice("batch");

export const batchActions = batch.actions;

export default batch.reducer;
