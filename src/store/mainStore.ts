import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainStore', {

    state: () => ({
        user: {},

    }),
    actions: {
        setUserLogged(user:any) {
            this.user = user
        },

        async resetStore () {
            this.user = {}

        }
    }
})
