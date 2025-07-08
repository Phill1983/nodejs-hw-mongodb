import * as authService from '../services/auth.js';

// контроллер регістрації

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await authService.registerUser({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// контроллер логіну

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await authService.loginUser({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// контроллер для оновлення сесії

export const refresh = async (req, res, next) => {
    try {
      const oldRefreshToken = req.cookies.refreshToken; 
      const { accessToken, refreshToken } = await authService.refreshSession(oldRefreshToken);
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
  
      res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  };

// контроллер для виходу з системи

  export const logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
  
      await authService.logoutUser(refreshToken);
  
      // Видаляємо куку
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
  
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
  