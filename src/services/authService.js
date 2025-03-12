import axios from 'axios'

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}accounts/auth/login/`, {
      username,
      password,
    })
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const registerStudent = async (username, password, email) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}accounts/auth/register/student/`,
      {
        username,
        password,
        email,
      },
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const registerInstructor = async (username, password, email) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}accounts/auth/register/instructor/`,
      {
        username,
        password,
        email,
      },
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const logout = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}accounts/auth/logout/`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
