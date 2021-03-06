import {Product} from '../product'
import * as fromRoot from '../../state/app.state'
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductActions, ProductActionTypes } from './product.action';

export interface State extends fromRoot.State {
    products: ProductState;
} 

export interface ProductState{
    showProductCode: boolean;
    currentProductId: number | null;
    products: Product[];
    error: string;
}

const initialState: ProductState = {
    showProductCode: true,
    currentProductId: null,
    products: [],
    error: ''
};

const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getShowProductCode = createSelector(
    getProductFeatureState,
    state => state.showProductCode
);

export const getCurrentProductId = createSelector(
    getProductFeatureState,
    state => state.currentProductId
);

export const getCurrentProduct = createSelector(
    getProductFeatureState,
    getCurrentProductId,
    (state, currentProductId) => {
        if (currentProductId == null || currentProductId === 0) {
            return {
                id: 0,
                productName: '',
                productCode: 'New',
                description: '',
                starRating: 0
            }
        } else {
            console.log("@@Current Product ID : "+currentProductId);
            return currentProductId ? state.products.find(p => p.id === currentProductId) : null;
        }
    }
);

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
);

export const getError = createSelector(
    getProductFeatureState,
    state => state.error
);

export function reducer(state = initialState, action: ProductActions): ProductState {
    switch(action.type){
        case ProductActionTypes.ToggleProductCode:
            //console.log('existing state: '+ JSON.stringify(state));
            //console.log('payload: '+ action.payload); 
            return {
                ...state,
                showProductCode: action.payload
            };

        case ProductActionTypes.SetCurrentProduct:
            //console.log('existing state: '+ JSON.stringify(state));
            //console.log('payload: '+ action.payload); 
            return {
                ...state,
                currentProductId: action.payload.id
            };
        
        case ProductActionTypes.ClearCurrentProduct:
            //console.log('existing state: '+ JSON.stringify(state));
            //console.log('payload: '+ action.payload); 
            return {
                ...state,
                currentProductId: null
            };
        
        case ProductActionTypes.InitializeCurrentProduct:
            console.log('existing state: '+ JSON.stringify(state));
            console.log('payload: '+ action.type);
            return {
                ...state,
                currentProductId: 0
            };
        
        case ProductActionTypes.LoadSuccess:
            return {
                ...state,
                products: action.payload,
                error: ''
            };

        case ProductActionTypes.LoadFail:
            return {
                ...state,
                products: [],
                error: action.payload
            };
        
        case ProductActionTypes.UpdateProductSuccess:
            const updatedProducts = state.products.map(item => item.id === action.payload.id ? action.payload : item);
            
            return {
                ...state,
                products: updatedProducts,
                error: ''
            };

        case ProductActionTypes.UpdateProductFail:
            return {
                ...state,
                products: [],
                error: action.payload
            };

        
        case ProductActionTypes.CreateProductSuccess:
            return {
                ...state,
                products: [...state.products, action.payload],
                currentProductId: action.payload.id,
                error: ''
            };

        case ProductActionTypes.CreateProductFail:
            return {
                ...state,
                products: [],
                error: action.payload
            };

        default:
            return state;
    }
}