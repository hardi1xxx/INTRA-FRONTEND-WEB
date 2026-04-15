import { generateMasterSlice } from "../masterState";

const reportPT3 = generateMasterSlice("reportPT3");

export const reportPT3Actions = reportPT3.actions;

export default reportPT3.reducer;
