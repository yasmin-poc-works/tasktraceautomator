import React from 'react'

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          TaskTraceAutomator
        </h1>
        <p className="mt-3 text-slate-400 text-sm">
          Traceable, governed workflow from meeting decisions to verified pull requests.
        </p>
        <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
          System Foundation Initialized
        </div>
      </div>
    </div>
  )
}

export default App

