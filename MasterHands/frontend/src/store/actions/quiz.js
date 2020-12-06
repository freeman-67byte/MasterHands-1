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

export function getСategories(id) {

  return (dispatch, getState) => {
    const { app } = getState(); // проверяем, есть ли в store данные по конретному id
    if (app.categories === id) return; // если нет, не выполняем дальше

    dispatch(setCategoriesId(id)); // устанавливаем id категории

    const { supercategories } = getState();

    let section = supercategories.flatMap(s => s.children);
    let payload = section.find(c => c.id == id);
    
    if (payload) {
      dispatch({
        type: GET_СATEGORIES,
        payload
      });
    }
  }
}

export function getServices(id) {

  return (dispatch, getState) => {

    const { app } = getState();
    if (app.services === id) return;

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

  return (dispatch, getState) => {
    try {
      dispatch(showLoader())

      const { app } = getState()
      if (app.service === id) {
        dispatch(hideLoader())
        return
      }

      dispatch(setServiceId(id));

      const { supercategories } = getState()

      let section = supercategories.flatMap(s =>
        s.children.flatMap(c => c.children))

      let services = section.flatMap(s => s.services)
      let service = services.find(s => s.id === id)

      dispatch({
        type: GET_SERVICE,
        service
      });

      dispatch(hideLoader())

    } catch (e) {
      console.error(e)
    }


  }
}

export function onEmptyStore(id, TYPE) {

  if (TYPE === GET_СATEGORIES) {

    return async dispatch => {
      await dispatch(fetchSupercategories());
      dispatch(getСategories(id));
    }
  } else if (TYPE === GET_SERVICES) {

    return async (dispatch, getState) => {
  
      await dispatch(fetchSupercategories())
      dispatch(getServices(id))
      const { services } = getState()
      services.parent_id ? await dispatch(getСategories(services.parent_id)) : null
    }

  } else if (TYPE === GET_SERVICE) {

    return async (dispatch, getState) => {
      await dispatch(fetchSupercategories())
      dispatch(getService(id))
      const { service } = getState();
      service.category ? dispatch(getServices(service.category)) : null
      const { services } = getState();
      services.parent_id ? dispatch(getСategories(services.parent_id)) : null
    }
  }
}



