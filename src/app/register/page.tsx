import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--background-color)] text-[var(--text-color)] transition-colors duration-300">
            <RegisterForm />
        </div>
    );
}
