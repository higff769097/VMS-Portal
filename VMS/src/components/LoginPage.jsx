import React, { useState } from 'react'

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        // Simulate a network delay for a more "proper" feel
        await new Promise(resolve => setTimeout(resolve, 800))

        if (username === 'admin' && password === 'Admin') {
            onLogin('admin')
        } else {
            setError('Invalid username or password. Please try again.')
            setIsSubmitting(false)
        }
    }

    const handleViewerAccess = () => {
        onLogin('viewer')
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, #111, #050505)',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Background Decorative Element */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '40%',
                height: '40%',
                background: 'var(--primary)',
                filter: 'blur(150px)',
                opacity: 0.1,
                borderRadius: '50%',
                pointerEvents: 'none'
            }}></div>

            <div className="glass" style={{
                width: '100%',
                maxWidth: '440px',
                padding: 'var(--spacing-2xl)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                animation: 'fadeIn 0.6s ease-out'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--primary)',
                        borderRadius: 'var(--radius-lg)',
                        margin: '0 auto var(--spacing-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontWeight: '900',
                        fontSize: '1.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 220, 130, 0.3)'
                    }}>
                        VMS
                    </div>
                    <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>
                        System Access
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                        Authorized personnel or staff access.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                    <div className="flex flex-col gap-xs">
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Identification
                        </label>
                        <input
                            className="glass"
                            style={{
                                padding: 'var(--spacing-md)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s ease'
                            }}
                            type="text"
                            required
                            autoFocus
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </div>

                    <div className="flex flex-col gap-xs">
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Security Credentials
                        </label>
                        <input
                            className="glass"
                            style={{
                                padding: 'var(--spacing-md)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s ease'
                            }}
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--error)',
                            padding: 'var(--spacing-sm)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--error)',
                            fontSize: '0.85rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-md" style={{ marginTop: 'var(--spacing-md)' }}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                            style={{
                                padding: 'var(--spacing-md)',
                                fontSize: '1rem',
                                height: '52px',
                                width: '100%'
                            }}
                        >
                            {isSubmitting ? 'Authenticating...' : 'Sign In as Owner'}
                        </button>

                        <div className="flex items-center gap-md" style={{ margin: 'var(--spacing-xs) 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleViewerAccess}
                            className="btn btn-secondary"
                            style={{
                                padding: 'var(--spacing-md)',
                                fontSize: '1rem',
                                height: '52px',
                                width: '100%',
                                background: 'transparent'
                            }}
                        >
                            Continue as Viewer
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    &copy; 2026 VMS Industry Portal
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus {
          border-color: var(--primary) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
        </div>
    )
}

export default LoginPage
