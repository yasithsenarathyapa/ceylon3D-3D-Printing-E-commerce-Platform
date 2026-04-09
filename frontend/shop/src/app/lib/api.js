
import { API_BASE_URL } from "./config";

function getAuthHeaders() {
	const token = localStorage.getItem("token");
	if (!token) {
		throw new Error("Please log in first");
	}

	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
}

async function postJson(path, body) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || `Request failed with status ${response.status}`);
	}

	return (await response.json());
}

async function authJson(path, options = {}) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: options.method || "GET",
		headers: getAuthHeaders(),
		body: options.body ? JSON.stringify(options.body) : undefined,
	});

	if (response.status === 401 || response.status === 403) {
		localStorage.removeItem("token");
		window.dispatchEvent(new Event("auth-change"));
		throw new Error("Session expired. Please log in again.");
	}

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || `Request failed with status ${response.status}`);
	}

	if (response.status === 204) {
		return null;
	}

	// Handle empty body responses (e.g. DELETE returning 200 with no body)
	const text = await response.text();
	if (!text) return null;
	return JSON.parse(text);
}

export function login(email, password) {
	return postJson("/auth/login", { email, password });
}

export function register(fullName, email, password) {
	return postJson("/auth/register", { fullName, email, password });
}

export function getAdminShopOrders() {
	return authJson("/orders/admin");
}

export function updateAdminShopOrderStatus(orderId, status) {
	return authJson(`/orders/admin/${orderId}/status`, {
		method: "PUT",
		body: { status },
	});
}

export function updateShopOrderTracking(orderId, trackingNumber) {
	return authJson(`/orders/admin/${orderId}/tracking`, {
		method: "PUT",
		body: { trackingNumber },
	});
}

export function getAdminStlOrders() {
	return authJson("/stl-orders/admin");
}

export function updateAdminStlOrderStatus(orderId, status) {
	return authJson(`/stl-orders/admin/${orderId}/status`, {
		method: "PUT",
		body: { status },
	});
}

export function calculateStlCost(params) {
	return authJson("/stl-orders/calculate-cost", {
		method: "POST",
		body: params,
	});
}

export function updateStlOrderPrice(orderId, estimatedPrice, calcData = {}) {
	return authJson(`/stl-orders/admin/${orderId}/price`, {
		method: "PUT",
		body: { estimatedPrice, ...calcData },
	});
}

export function deleteStlOrder(orderId) {
	return authJson(`/stl-orders/admin/${orderId}`, {
		method: "DELETE",
	});
}

export function getStlOrderDownloadUrl(orderId) {
	const token = localStorage.getItem("token");
	return `${API_BASE_URL}/stl-orders/admin/${orderId}/download?token=${encodeURIComponent(token || "")}`;
}

export function downloadStlOrderFile(orderId) {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("Please log in first");

	return fetch(`${API_BASE_URL}/stl-orders/admin/${orderId}/download`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(async (res) => {
		if (!res.ok) throw new Error("File download failed");
		const blob = await res.blob();
		const contentDisposition = res.headers.get("Content-Disposition");
		let filename = "download";
		if (contentDisposition) {
			const match = contentDisposition.match(/filename="?(.+?)"?$/);
			if (match) filename = match[1];
		}
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	});
}

export function placeOrder(shippingAddress, items) {
	return authJson("/orders", {
		method: "POST",
		body: { shippingAddress, items },
	});
}

export function getMyOrders() {
	return authJson("/orders");
}

export function getMyStlOrders() {
	return authJson("/stl-orders/my");
}

export function updateMyStlOrder(orderId, data) {
	return authJson(`/stl-orders/my/${orderId}`, {
		method: "PUT",
		body: data,
	});
}

export function confirmStlOrder(orderId) {
	return authJson(`/stl-orders/my/${orderId}/confirm`, {
		method: "PUT",
	});
}

export function createProduct(formData) {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("Please log in first");

	return fetch(`${API_BASE_URL}/products`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	}).then(async (res) => {
		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(errorText || "Product creation failed");
		}
		return res.json();
	});
}

export function getAllProducts() {
	return fetch(`${API_BASE_URL}/products`).then(async (res) => {
		if (!res.ok) throw new Error("Failed to fetch products");
		return res.json();
	});
}

export function updateProduct(id, formData) {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("Please log in first");

	return fetch(`${API_BASE_URL}/products/${id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	}).then(async (res) => {
		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(errorText || "Product update failed");
		}
		return res.json();
	});
}

export function deleteProduct(id) {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("Please log in first");

	return fetch(`${API_BASE_URL}/products/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(async (res) => {
		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(errorText || "Product deletion failed");
		}
		return null;
	});
}

// ── Cart API ────────────────────────────────────────────────

export function getCart() {
	return authJson("/cart");
}

export function addToCartApi(productId, quantity = 1) {
	return authJson("/cart", {
		method: "POST",
		body: { productId, quantity },
	});
}

export function updateCartItem(cartItemId, quantity) {
	return authJson(`/cart/${cartItemId}`, {
		method: "PUT",
		body: { quantity },
	});
}

export function removeCartItem(cartItemId) {
	return authJson(`/cart/${cartItemId}`, {
		method: "DELETE",
	});
}

export function clearCartApi() {
	return authJson("/cart", {
		method: "DELETE",
	});
}
