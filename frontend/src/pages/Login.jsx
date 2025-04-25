import { useRegisterUserMutation, useLoginUserMutation } from "@/featureSlice/api/authApi"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" })
  const [signup, setSignup] = useState({ name: "", email: "", password: "" })

  const navigate = useNavigate()

  // use Mutation state
  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation()
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation()


  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;

    if (type === "signup") {
      setSignup({ ...signup, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const hanleRegistration = async (type) => {
    const inputData = type === "signup" ? signup : loginInput;
    // api calling 
    const action = type === "signup" ? registerUser : loginUser
    await action(inputData)
  }


  const handleSubmit = (e) => {
    e.preventDefault()
  }

  // showing toast effect of user login or logourt etc

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerError.message || "signup successfully")
    }
    if (registerError) {
      toast.error(registerData.data?.message || "Signup Failed")
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "login successfully");
      navigate('/')
    }
    if (loginError) {
      toast.error(loginError.data?.message || "Login failed")
    }
  }, [loginIsSuccess, registerIsSuccess, loginData, registerData, loginError, registerError])

  return (
    <div className="flex items-center justify-center h-screen bg-[#ccc]">
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">SignUp</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Signup</CardTitle>
                <CardDescription>
                  Create a new account and click signup when you're done
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    onChange={(e) => changeInputHandler(e, "signup")}
                    name="name"
                    value={signup.name}
                    text="text" placeholder="Enter Your Name" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    onChange={(e) => changeInputHandler(e, "signup")}
                    name="email"
                    value={signup.email}
                    autoComplete="username"
                    type="email" placeholder="Enter Your Email" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Password</Label>
                  <Input
                    onChange={(e) => changeInputHandler(e, "signup")}
                    name="password"
                    value={signup.password}
                    type="password"
                    placeholder="Enter Your Password"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={registerIsLoading}
                  onClick={() => hanleRegistration('signup')}
                >{
                    registerIsLoading ? (<>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>) : "Signup"
                  }
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Email</Label>
                  <Input
                    onChange={(e) => changeInputHandler(e, "login")}
                    name="email"
                    value={loginInput.email}
                    type="email"
                    placeholder='Enter Your Email'

                    required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">Password</Label>
                  <Input
                    onChange={(e) => changeInputHandler(e, "login")}
                    value={loginInput.password}
                    name="password"
                    autoComplete="current-password "
                    type="password"

                    placeholder="Enter Your Password" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={loginIsLoading}
                  onClick={() => hanleRegistration("login")}>
                  {
                    loginIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </>
                    ) : "Login"
                  }
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>

  )
}

export default Login;