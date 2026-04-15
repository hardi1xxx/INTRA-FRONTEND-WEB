import { generateMasterSlice } from "../masterState";

const statusLapangan = generateMasterSlice("statusLapangan");

export const statusLapanganActions = statusLapangan.actions;

export default statusLapangan.reducer;
