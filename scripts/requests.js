async function loginRequest(url, payload) {
    try {
        const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(payload) });
        if(response.ok){
            const data = await response.json();
            localStorage.setItem("userData", JSON.stringify(data));
            if(data.role == "ORGANIZER") window.location.href = "../../pages/myEvents/myEvents.html";
            if(data.role == "MERCHANT") window.location.href = "../../pages/myParticipations/myParticipations.html";
        }        
    } catch (error) {
        console.log(error);
    }
}

async function getRequestPublic(url) {
    try {
        const response = await fetch(url, { method: "GET" });
        if(response.status == 401) {
            console.log(response);
            await refreshToken(userStorage);
        }
        if(response.ok){
            const date = await response.json() || null;
            return date;
        }
    } catch (error) {
        console.log(error);        
    }
}

async function getRequest(url, userStorage) {
    try {
        const response = await fetch(url, { method: "GET", headers: { "Authorization": `Bearer ${ userStorage.accessToken }` } });
        if(response.status == 401) {
            console.log(response);
            await refreshToken(userStorage);
        }
        if(response.ok){
            const date = await response.json() || null;
            return date;
        }
    } catch (error) {
        console.log(error);        
    }
}

async function postRequest(url, userStorage, payload) {
    try {
        const response = await fetch(url, { method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${ userStorage.accessToken }` },
            body: JSON.stringify(payload)
        });
        if(response.status == 401) {
            console.log(response);
            await refreshToken(userStorage);
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function putRequest(url, userStorage, payload) {
    try {
        const response = await fetch(url, { method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${ userStorage.accessToken }` },
            body: JSON.stringify(payload)
        });
        if(response.status == 401) {
            console.log(response);
            await refreshToken(userStorage);
        }
        return response
    } catch (error) {
        console.log(error);
    }
}

async function deleteRequest(url, userStorage) {
    try {
        const response = await fetch(url, { method: "DELETE", headers: { "Authorization": `Bearer ${ userStorage.accessToken }` } })
        if(response.status == 401) {
            console.log(response);
            await refreshToken(userStorage);
        }      
    } catch (error) {
        console.log(error);
    }
}

async function refreshToken(userStorage) {
    try {
    const response = await fetch(`http://localhost:8080/auth/refresh/${userStorage.email}`, { method: "PUT", headers: { "Authorization": `Bearer ${ userStorage.refreshToken }` } })
    if(response.status == 401) {
        localStorage.clear();
        window.location.href = "../../index.html";
    }
    if(response.ok) {
        const data = await response.json();
        localStorage.setItem("userData", JSON.stringify(data));
        location.reload();
    }        
    } catch (error) {
        console.log(error);
    }    
}