export interface ElementoAdicional {
  id: number;
  nombre_elemento: string;
  path_foto_elemento: string;
  equipos_o_elementos_id: number;
}

export interface Equipment {
  id: number;
  sn_equipo: string | null;
  marca: string | null;
  color: string | null;
  tipo_elemento: string | null;
  descripcion: string | null;
  qr_hash: string | null;
  path_foto_equipo_implemento: string | null;
  elementos_adicionales: ElementoAdicional[];
}

export interface EquipmentQR {
  sn_equipo: string;
  color: string;
}