export interface ElementoAdicional {
  id: number;
  nombre_elemento: string;
  path_foto_elemento: string;
  equipos_o_elementos_id: number;
}

export interface Equipment {
  id: number;
  sn_equipo: string;
  marca: string;
  color: string;
  tipo_elemento: string;
  descripcion: string;
  qr_hash: string;
  path_foto_equipo_implemento: string;
  elementos_adicionales: ElementoAdicional[];
}

export interface EquipmentQR{
  sn_equipo: string;
  color: string;
}