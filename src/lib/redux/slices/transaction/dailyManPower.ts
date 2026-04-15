import { generateMasterSlice } from "../masterState";

const dailyManPower = generateMasterSlice("dailyManPower");

export const dailyManPowerActions = dailyManPower.actions;

export default dailyManPower.reducer;
