import * as types from "./mutations-type"
import axios from 'axios'
import {
    Get_Demo_URL,
} from '@/api/index'

export default {
	getDemoName(state){
		axios.get(Get_Demo_URL).then((res)=>{
			state.commit(types.SET_DEMO, res.data.demoName);
		}).catch(function (error) {
	    console.log(error);
	  });	
	}
}