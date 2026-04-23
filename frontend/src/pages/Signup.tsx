import { FC } from "react";
import { useSignup } from "../modules/signup/hooks";

const Signup: FC = () => {
  const { formData, error, message, handleChange, handleSubmit } = useSignup();

  return (
    <div className="container mx-auto mt-10 max-w-md px-4">
      <h2 className="mb-4 text-2xl font-bold text-[#e6edf3]">Sign Up</h2>
      {message && (
        <p className="mb-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#161b22] p-3 text-sm text-[#8b949e]">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#161b22] p-3 text-sm text-[#8b949e]">
          {error}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="rounded-md border border-[#30363d] bg-[#161b22] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
      >
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-[#58a6ff] p-3 font-semibold text-[#0d1117] transition hover:bg-[#79c0ff]"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
