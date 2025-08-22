import { useState } from "react"
import { Form, Input, Button, Checkbox, Select, Card, Tabs, message } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { saveInfo } from "@/libs/utils/authUtils"
import { post } from "@/libs/api";
import { useRouter } from "next/router";

const { TabPane } = Tabs
const { Option } = Select

export default function AuthPage() {
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onLoginFinish = async (values) => {
    setLoading(true)
    const res = await post('/auth/login', values, { skipAuthRedirect: true });
    if (res.status == 200) {
      handleLoggedIn({...res.data, ...loginForm.getFieldValue()});
    }
    setLoading(false);
  }

  const handleLoggedIn = (data) => {
    saveInfo(data);
    message.success('Đăng nhập thành công');
    router.push('/');
  }

  const onRegisterFinish = async (values) => {
    setLoading(true)
    const res = await post('auth/register', values);
    if (res.status == 200) {
      loginForm.setFieldsValue({email: values.email});
      message.success('Đăng ký thành công');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <Card
        className="w-full max-w-md relative z-10 shadow-2xl border-0"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "1rem",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        <Tabs
          defaultActiveKey="login"
          centered
          className="auth-tabs"
          style={
            {
              "--ant-primary-color": "var(--primary)",
            }
          }
        >
          <TabPane tab="Login" key="login">
            <Form
              form={loginForm}
              name="login"
              onFinish={onLoginFinish}
              layout="vertical"
              size="large"
              className="space-y-4"
            >
              <Form.Item
                name="userName"
                label="Username"
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-muted-foreground" />}
                  placeholder="Enter your username"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-muted-foreground" />}
                  placeholder="Enter your password"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox className="text-foreground">Remember me</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-12 rounded-lg bg-primary hover:bg-accent border-0 text-lg font-medium"
                >
                  Sign In
                </Button>
              </Form.Item>

              <div className="text-center">
                <a href="#" className="text-accent hover:text-primary transition-colors">
                  Forgot your password?
                </a>
              </div>
            </Form>
          </TabPane>

          <TabPane tab="Register" key="register">
            <Form
              form={registerForm}
              name="register"
              onFinish={onRegisterFinish}
              layout="vertical"
              size="large"
              className="space-y-4"
            >
              <Form.Item
                name="userName"
                label="Username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  { min: 3, message: "Username must be at least 3 characters!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-muted-foreground" />}
                  placeholder="Choose a username"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  { min: 6, message: "Password must be at least 6 characters!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-muted-foreground" />}
                  placeholder="Create a password"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error("Passwords do not match!"))
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-muted-foreground" />}
                  placeholder="Confirm your password"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="userType"
                label="User Type"
                rules={[{ required: true, message: "Please select your user type!" }]}
              >
                <Select placeholder="Select user type" className="rounded-lg" size="large">
                  <Option value="User">User</Option>
                  <Option value="Partner">Partner</Option>
                  <Option value="Admin">Admin</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-12 rounded-lg bg-primary hover:bg-accent border-0 text-lg font-medium"
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>

      <style jsx global>{`
        .auth-tabs .ant-tabs-tab {
          color: var(--muted-foreground) !important;
          font-weight: 500;
        }
        
        .auth-tabs .ant-tabs-tab-active {
          color: var(--primary) !important;
        }
        
        .auth-tabs .ant-tabs-ink-bar {
          background: var(--primary) !important;
        }
        
        .ant-input-affix-wrapper {
          border-color: var(--border) !important;
        }
        
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px var(--ring) !important;
        }
        
        .ant-select-selector {
          border-color: var(--border) !important;
        }
        
        .ant-select-focused .ant-select-selector {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px var(--ring) !important;
        }
      `}</style>
    </div>
  )
}
