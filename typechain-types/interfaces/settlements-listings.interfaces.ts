import {OrderStatus} from "../enums";

export interface BaseOrder {
    orderOwner: string,
    sellingTokenAddress: string,
    price: bigint,
    bannerId: bigint,
    status: OrderStatus
}

export interface Order extends BaseOrder {
    orderId: bigint,
    sellingTokenSymbol: string;
}
