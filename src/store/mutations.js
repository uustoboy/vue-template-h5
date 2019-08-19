import * as types from './mutations-type';

export default {
	[types.SET_DEMO](state, name) {
        state.demoName = name;
    },
}