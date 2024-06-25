import { account } from '../appwriteConfig';

export const getUser = async () => {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        console.error(error);
        alert('Failed to fetch user information');
        return null;
    }
};
