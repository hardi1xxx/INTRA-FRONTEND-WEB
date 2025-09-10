import * as yup from "yup";

export const upsertReportPT3Schema = yup.object().shape({
  id_ihld: yup.string().nullable(),
  tematik: yup.string().nullable(),
  status_osm: yup.string().nullable(),
  lop: yup.string().nullable(),
  sto: yup.string().nullable(),
  witel: yup.string().nullable(),
  id_pid: yup.string().nullable(),
  id_sap: yup.string().nullable(),

  jumlah_odp_drm: yup.string().nullable(),
  jumlah_port_drm: yup.string().nullable(),
  jumlah_odp_real: yup.string().nullable(),
  jumlah_port_real: yup.string().nullable(),
  kalkulasi_port: yup.string().nullable(),
  dev_port: yup.string().nullable(),
  nilai_material_drm: yup.string().nullable(),

  status_fisik: yup.string().nullable(),
  status_lapangan: yup.string().nullable(),
  keterangan: yup.string().nullable(),

  komit_fi_awal: yup.string().nullable(),
  komit_fi_update: yup.string().nullable(),
  finish_instalasi: yup.string().nullable(),
  finish_instal_diagram_hari: yup.string().nullable(),

  komit_gl_awal: yup.string().nullable(),
  komit_golive_update: yup.string().nullable(),
  golive: yup.string().nullable(),
  tanggal_golive_diagram_hari: yup.string().nullable(),

  tanggal_perizinan: yup.string().nullable(),
  nama_mitra: yup.string().nullable(),
  pembayaran_cc: yup.string().nullable(),
  tgl_eprop: yup.string().nullable(),
  day: yup.string().nullable(),

  weekly_gl: yup.string().nullable(),
  weekly_komit_gl: yup.string().nullable(),
  durasi_perizinan: yup.string().nullable(),
  po: yup.string().nullable(),
  regional_area: yup.string().nullable(),

  m_golive: yup.string().nullable(),
  y_golive: yup.string().nullable(),

  status_tomps: yup.string().nullable(),
  tanggal: yup.string().nullable(),

  status_ihld_0608: yup.string().nullable(),
  status_ihld_1108: yup.string().nullable(),
  status_ihld: yup.string().nullable(),
  status_eproposal: yup.string().nullable(),
  status_proyek: yup.string().nullable(),

  telkomsel_branch: yup.string().nullable(),
  batch: yup.string().nullable(),
  status_lop_ed: yup.string().nullable(),
  status_lop_kons2025: yup.string().nullable(),
  status_smile: yup.string().nullable(),

  bast_material: yup.string().nullable(),
  bast_jasa: yup.string().nullable(),

  durasi_eprop_to_fi: yup.string().nullable(),
  durasi_fi_to_golive: yup.string().nullable(),
  durasi_eprop_to_golive: yup.string().nullable(),

  bulan_submit_to_eprop: yup.string().nullable(),
  year_submit_to_eprop: yup.string().nullable(),
  sla_pt3: yup.string().nullable(),
  branch: yup.string().nullable(),
  idsw: yup.string().nullable(),
  bulan_golive: yup.string().nullable(),
});

export type UpsertReportPT3Request = yup.InferType<typeof upsertReportPT3Schema>;
