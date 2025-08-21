const SignupUser = async (body) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}api/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.error || "Error al registrar usuario",
    };

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return {
      success: false,
      error: "Error de conexión al registrar usuario",
    };
  }
};

export const userService = {
    SignupUser
};
