export interface Product {
	id?: number;
	name?: string;
	slug?: string;
	price?: number;
	sale_price?: number;
	review?: number;
	ratings?: number;
	until?: string;
	stock?: number;
	top?: boolean; 
	featured?: boolean;
	new?: boolean;
	short_desc?: boolean;
	category?: Array<{
		name?: string;
		slug?: string;
	}>;
	pictures?: Array<{
		width?: number;
		height?: number;
		url: number;
	}>;
	sm_pictures?: Array<{
		width?: number;
		height?: number;
		url?: number;
	}>
	variants?: Array<{
		id?:string;
		color?: string;
		color_name?: string;
		price?: number;
		name:string;
		size?: Array<{
			name?: string;
		}>
		quantity?:number
	}>
	quantity?:number;
}