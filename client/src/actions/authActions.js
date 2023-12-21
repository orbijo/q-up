export const loginSuccess = (userOrBusiness, token) => ({
    type: 'auth/setLogin',
    payload: {
        user: userOrBusiness.type === 'user' ? userOrBusiness : null,
        business: userOrBusiness.type === 'business' ? userOrBusiness : null,
        token,
    },
});