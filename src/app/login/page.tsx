import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--background-color)] text-[var(--text-color)] transition-colors duration-300">
            <LoginForm />
        </div>
    );
}
