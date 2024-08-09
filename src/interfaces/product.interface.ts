import { ICategory } from "./category.interface";
import { IFlavour } from "./flavour.interface";

export interface IProduct {

    id: string,
    name: string,
    description: string,
    price: number,
    image: string,
    state: boolean,
    flavour: IFlavour[],
    category: ICategory

}