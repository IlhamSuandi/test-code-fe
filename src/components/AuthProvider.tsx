import { useGoogleCallback } from "@/hooks/auth/useGoogleLogin"
import { useToken } from "@/hooks/auth/useToken"
import { useTokenState } from "@/states/auth"
import { getTokenRemainingTime } from "@/utils/token"
import { useCallback, useEffect } from "react"
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router"
import Loading from "./Loading"

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { token, isAuthenticated, setToken } = useTokenState()
  const { mutate: getNewToken, } = useToken()
  const { mutate: googleLogin } = useGoogleCallback()

  const isAuthPath = location.pathname.startsWith("/auth/") || location.pathname.startsWith("/google/")
  const isCallback = location.pathname.startsWith("/google/callback")

  useEffect(() => {
    if (!isCallback) {
      return
    }
    const state = searchParams.get("state")
    const code = searchParams.get("code")

    if (!state || !code) {
      return
    }
    googleLogin({ code, state })
  }, [googleLogin, searchParams, isCallback])
  // Token expiration checker
  const checkTokenExpiration = useCallback(() => {
    const tokenRemainingTime = getTokenRemainingTime(token?.accessToken)
    const expirationThreshold = 1000 * 10 // 10 seconds
    // console.log("tokenRemainingTime", tokenRemainingTime)

    if (tokenRemainingTime < expirationThreshold) {
      setToken(undefined)
      getNewToken()
    }
  }, [getNewToken, setToken, token])

  // Effect to monitor token expiration
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    if (isAuthPath && isAuthenticated) {
      console.log("effect: is authenticated and is auth path")
      navigate("/")
      return
    }

    const interval = setInterval(checkTokenExpiration, 1000)
    return () => clearInterval(interval)
  }, [isAuthenticated, isAuthPath, navigate, checkTokenExpiration])

  // Redirect based on authentication state
  if (!isAuthPath && !isAuthenticated) {
    console.log("redirect: is not authenticated and is not auth path")
    return <Navigate to='/auth/login' />
  }

  if (isAuthPath && isAuthenticated) {
    console.log("redirect: is authenticated and is auth path")
    return <Navigate to='/' />
  }

  // TODO: make custom loading screen
  if (isCallback) {
    return <Loading />
  }

  return <>{children}</>
}
