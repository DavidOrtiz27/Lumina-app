import luminaApi from './luminaApi';

export const getAuthenticatedImageUrl = async (imagePath: string): Promise<string | null> => {
    try {
        // La URL completa ya incluye /api, entonces solo necesitamos el imagePath
        const response = await luminaApi.get(imagePath, {
            responseType: 'blob', // Importante para obtener la imagen como Blob
        });

        if (response.data) {
            const imageUrl = URL.createObjectURL(response.data);
            return imageUrl;
        }
        return null;
    } catch (error) {
        console.error('Error fetching authenticated image:', error);
        return null;
    }
};

export const revokeAuthenticatedImageUrl = (url: string) => {
    URL.revokeObjectURL(url);
};
