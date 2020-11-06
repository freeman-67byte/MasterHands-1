import axios from '../../axios/axios-quiz'
import { source } from '../../axios/axios-quiz'
import {
  FETCH_SUPERCATEGORIES, FETCH_SERVICES,
  GET_СATEGORIES, GET_SERVICES, GET_SERVICE
} from './actionTypes'
import {
  hideLoader, showLoader, setCategoriesId,
  setServicesId, setServiceId
} from '../actions/app'



export function fetchSupercategories() {

  return async dispatch => {
    try {
      dispatch(showLoader());

      const url = `/api/categories/0`;
      const response = await axios.get(url, { cancelToken: source.token });

      dispatch({
        type: FETCH_SUPERCATEGORIES,
        supercategories: response.data
      });

      dispatch(hideLoader());

    } catch (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader())
      } else {
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader())
      }
    }
  }
}

export function getAllServices() {
  return async dispatch => {
    try {
      const url = `/api/categories/2`
      const response = await axios.get(url)
      dispatch({
        type: FETCH_SERVICES,
        allServices: response.data
      })

    } catch (e) {
      console.error(e)
    }
  }
}

export function fetchСategories(id) {

  return async (dispatch, getState) => {

    const { app } = getState();
    if (app.categories === id) return;

    try {
      dispatch(showLoader());
      dispatch(setCategoriesId(id));

      const url = `/api/categories/${id}`;  // const url = `${API_URL}/api/categories/${id}`;
      const response = await axios.get(url, { cancelToken: source.token });

      dispatch({
        type: FETCH_СATEGORIES,
        categories: response.data
      });

      dispatch(hideLoader());

    } catch (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader())
      } else {
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader())
      }
    }
  }
}

export function fetchServices(id) {

  return async (dispatch, getState) => {

    const { app } = getState()
    if (app.services === id) return;

    try {
      dispatch(showLoader());
      dispatch(setServicesId(id));

      const url = `/api/subcategories/${id}`;
      const response = await axios.get(url, { cancelToken: source.token })

      dispatch({
        type: FETCH_SERVICES,
        services: response.data
      });

      dispatch(hideLoader());

    } catch (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader());
      } else {
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader());
      }
    }
  }
}

export function fetchService(id) {

  return async (dispatch, getState) => {

    const { app } = getState()
    if (app.service === id) return;

    try {
      dispatch(showLoader());
      dispatch(setServiceId(id));

      const url = `/api/services/${id}`;
      const response = await axios.get(url, { cancelToken: source.token })

      dispatch({
        type: FETCH_SERVICE,
        service: response.data
      });

      dispatch(hideLoader());

    } catch (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader())
      } else {
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader())
      }
    }
  }
}

export function onEmptyStore(link, TYPE) {

  return async dispatch => {

    try {
      dispatch(showLoader());

      const url = `/api${link}`;
      const response = await axios.get(url, { cancelToken: source.token })
      console.log(response.data)
      dispatch({
        type: TYPE,
        payload: response.data
      });

      dispatch(hideLoader());

    } catch (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader())
      } else {
        /* dispatch(showAlert('Что-то пошло не так...', 'danger')) */
        dispatch(hideLoader())
      }
    }
  }
}


//function memoizedСategories() {
//  let cache = {};
//  return (id) => {
//    if (id in cache) {
 //     return; // ничего не нужно возвращать
 //   }
 //   else {
 //     const supercategories = useSelector(state => state.supercategories);
      /* return dispatch(fetchСategories(id)); */
  //    let payload = supercategories.map(s => {
  //      s.children.filter(c => c.id === id)
 //     });
 //     dispatch({
//        type: GET_СATEGORIES,
//        payload
//      });
//      cache[id] = id;
 //     return; // ничего не нужно возвращать
 //   }
 // }
//}
  
//export const getСategories = memoizedСategories();

export function getСategories(id) {

  return async (dispatch, getState) => {
    const { app } = getState(); // проверяем, есть ли в store данные по конретному id
    if (app.categories === id) return; // если нет, не выполняем дальше

    dispatch(setCategoriesId(id)); // устанавливаем id категории

    const { supercategories } = getState();
      
    let section = supercategories.flatMap(s => s.children);
    let payload = section.find(c => c.id == id);
  
    dispatch({
      type: GET_СATEGORIES,
      payload
    });
  }  
}

export function getServices(id) {

  return async (dispatch, getState) => {
    const { app } = getState();
    /* const { allServices } = getState(); */
    if (app.services === id) return; 
    /* if (allServices.services.length) return; */

    dispatch(setServicesId(id)); 

    const { supercategories } = getState();

    let section = supercategories.flatMap(s =>
      s.children.flatMap(c => c.children))
        let services = section.find(s => s.id === id)
  
    dispatch({
      type: GET_SERVICES,
      services
    });
  }  
}

export function getService(id) {

  return async (dispatch, getState) => {
    const { app } = getState();
    /* const { allServices } = getState(); */
    if (app.service === id) return; 
    /* if (allServices.services.length) return; */

    dispatch(setServiceId(id)); 

    const { supercategories } = getState();

    let section = supercategories.flatMap(s =>
      s.children.flatMap(c => c.children))
        let service = section.find(s => s.id === id)
  
    dispatch({
      type: GET_SERVICE,
      service
    });
  }  
}




