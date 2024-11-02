export interface Sensor {
    sensor_id: number;
    tipo: string;
    tipo_medida: string;
    unidade_medida: string;
}

export interface Comodo {
    comodo_id: number;
    nome: string;
    sensores: Sensor[];
}

export interface Residencia {
    residencia_id: number;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
    comodos: Comodo[];
}