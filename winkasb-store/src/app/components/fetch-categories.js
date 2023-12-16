import http from "../axios-instances";

async function fetchCategories(token) {
  try {
    const { data } = await http.get("/admin/category/all", {
      headers: { Authorization: "Bearer " + token },
    });
    const titles =
      data?.status === 200 &&
      data?.categories &&
      data.categories.map((c) => {
        return { label: c.title, value: c.title };
      });
    return titles;
  } catch (error) {
    throw error?.response?.data?.message ?? error?.message ?? error;
  }
}

export { fetchCategories };
