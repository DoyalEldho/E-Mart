import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';


export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: "" })
  const [showPassword, setShowPassword] = useState(false);
  const naviagte = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/auth/api/register', form, { withCredentials: true })
      toast.success('Registered successfully!');
      naviagte('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed')
    }
  }

  //Receives a token (response.credential) from Google OAuth.
  // Decodes it using jwtDecode to extract email, name, and Google ID (sub).
  const handleGoogleSuccess = async (response) => {
    try {
      const decoded = jwtDecode(response.credential)
      await axios.post('http://localhost:5000/auth/api/google', {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
      }, { withCredentials: true })
      toast.success('Google Registered success!');
      localStorage.setItem('isLoggedIn', 'true');
      naviagte('/userDashboard');
    } catch (error) {

      toast.error('Google Sign-in failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-900 text-white p-4">
      <div className="bg-slate-700 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded bg-slate-600 outline-none"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded bg-slate-600 outline-none"
            onChange={handleChange}
            required
          />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 rounded bg-slate-600 outline-none pr-10"
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <input
            name="role"
            type="text"
            placeholder="Role (eg..customer)"
            className="w-full p-3 rounded bg-slate-600 outline-none text-white"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300"
          >
            Register
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm">OR</p>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert('Google Login failed')} />
        </div>

        <p className="text-center mt-6 text-sm text-gray-300">
          Already have an account? <a href="/login" className="text-yellow-400 font-semibold">Login</a>
        </p>
      </div>
    </div>
  );
}

