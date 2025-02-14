import { sdk } from "@lib/config" // Assuming you've set up the SDK as explained in the documentation

export const fetchBlogs = async (limit: number, offset: number) => {
    try {
      const response = await sdk.client.fetch(`/store/blogs`, {
        query: { limit, offset },
      });
      // Optionally, check if the response is an error array:
      if (Array.isArray(response) && response.some(item => item.error)) {
        throw new Error("API returned errors: " + JSON.stringify(response));
      }
      return response;
    } catch (error) {
      console.error("Error in fetchBlogs:", error);
      throw error;
    }
  }

  export const fetchBlogById = async (id:string) => {
    try {
      const response = await sdk.client.fetch(`/store/blogs/${id}`);
      // Optionally, check if the response is an error array:
      if (Array.isArray(response) && response.some(item => item.error)) {
        throw new Error("API returned errors: " + JSON.stringify(response));
      }
      return response;
    } catch (error) {
      console.error("Error in fetchBlogs:", error);
      throw error;
    }
  }
  