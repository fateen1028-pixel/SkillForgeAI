class ConcurrencyError(Exception):
    """Raised when an update fails due to a version mismatch."""
    pass

class TemplateResolutionError(Exception):
    """Raised when a task template cannot be resolved."""
    pass

class AuthError(Exception):
    """Base class for authentication errors."""
    def __init__(self, message: str, detail: str = None):
        self.message = message
        self.detail = detail
        super().__init__(message)

class InvalidCredentialsError(AuthError):
    """Raised when login fails due to wrong email or password."""
    pass

class UserAlreadyExistsError(AuthError):
    """Raised when registration fails because the email is taken."""
    pass

class TokenExpiredError(AuthError):
    """Raised when a JWT token has expired."""
    pass

class InvalidTokenError(AuthError):
    """Raised when a JWT token is invalid or type mismatch."""
    pass
