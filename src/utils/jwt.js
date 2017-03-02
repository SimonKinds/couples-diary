import jwt from 'jsonwebtoken'

export const getJwtToken = () => {
  return localStorage.getItem('jwtToken')
}

export const setJwtToken = token => {
  localStorage.setItem('jwtToken', token)
}

export const buildUserFromToken = (token = getJwtToken())  => {
  try {
    // we won't verify on client side, just decode
    // if the token is invalid the server should tell us so
    const decodedToken = jwt.decode(token)
    return {
      id: decodedToken.userId,
      username: decodedToken.username,
      coupleId: decodedToken.coupleId
    }
  } catch(err) {
    return undefined
  }
}
