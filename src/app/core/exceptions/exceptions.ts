// Clase para manejar los errores de la API que llegan desde el backend
export class Exception {

    backendErrors: Record<string, string> = {};
    isLoading = false;

    handleBackendErrors(err: any) {
        if (err.status === 409) {
            switch (err.error.message) {
                case 'USERNAME_ALREADY_EXISTS':
                    this.backendErrors['username'] = 'Username already in use';
                    break;
                case 'EMAIL_ALREADY_EXISTS':
                    this.backendErrors['email'] = 'Email already in use';
                    break;
            }
        } else if (err.status === 401) {
            switch (err.error.message) {
                case 'INVALID_CREDENTIALS':
                    this.backendErrors['usernameOrEmail'] = 'Invalid credentials';
                    break;
            }
        }
    }

}