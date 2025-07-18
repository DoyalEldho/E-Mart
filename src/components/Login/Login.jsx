import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'; 
import toast from 'react-hot-toast';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res= await axios.post('http://localhost:5000/auth/api/login', form, { withCredentials: true })
  
      const { role } = res.data;
      if(role === 'admin'){
         localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('isLoggedIn', 'true');
         return navigate('/adminDashboard',{ replace:true });
        }
        
        //user
     localStorage.setItem('isLoggedIn', 'true');
     localStorage.setItem('isUser', 'true');
     toast.success('Login successfully!');
     navigate('/userDashboard');
    } catch (err) {
 
        toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  const handleGoogleSuccess = async (res) => {
    try {
      const decoded = jwtDecode(res.credential)
      await axios.post('http://localhost:5000/auth/api/google', {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
      }, { withCredentials: true })
     toast.success('Google Login success!');
     localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isUser', 'true');
      navigate('/userDashboard');
     
    } catch (err) {
        toast.error('Google login failed')
    
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-900 text-white p-4">
      <div className="bg-slate-700 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-600"
            onChange={handleChange}
            required
          />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 rounded bg-slate-600 pr-10"
              onChange={handleChange}
              required
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          <button className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300">
            Login
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm">OR</p>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert('Google Login failed')} />
        </div>

        <p className="text-center mt-6 text-sm text-gray-300">
          Don't have an account?{' '}
          <a href="/" className="text-yellow-400 font-semibold">Register</a>
        </p>
      </div>
    </div>
  )
}
