async function getUser() {
    // 로딩 시 사용자 가져오는 함수
    try {
        const res = await axios.get("/users");
        const users = res.data;
        const list = document.getElementById("list");
        list.innerHTML = "";
        // 사용자마다 반복적으로 화면 표시 및 이벤트 연결
        Object.keys(users).map(function (key) {
            const userDiv = document.createElement("div");
            const span1 = document.createElement("span");
            span1.textContent = users[key].name;
            const span2 = [];
            for (let i = 0; i < users[key].cmmt.length; i++) {
                span2[i] = document.createElement("div");
                span2[i].style.paddingLeft = "10px";
                span2[i].textContent = users[key].cmmt[i];
            }
            const edit = document.createElement("button");
            edit.textContent = "수정";
            edit.addEventListener("click", async () => {
                // 수정 버튼 클릭
                const name = prompt("바꿀 이름을 입력하세요");
                if (!name) {
                    return alert("이름을 반드시 입력하셔야 합니다");
                }
                try {
                    await axios.put("/user/" + key, { name });
                    getUser();
                } catch (err) {
                    console.error(err);
                }
            });
            const remove = document.createElement("button");
            remove.textContent = "삭제";
            remove.addEventListener("click", async () => {
                // 삭제 버튼 클릭
                try {
                    await axios.delete("/user/" + key);
                    getUser();
                } catch (err) {
                    console.error(err);
                }
            });
            const cmmtBtn = document.createElement("button");
            cmmtBtn.textContent = "댓글달기";
            cmmtBtn.addEventListener("click", async () => {
                // 수정 버튼 클릭
                const cmmt = prompt("작성할 댓글을 적어주세요.");
                if (!cmmt) {
                    return alert("댓글을 반드시 입력하셔야 합니다");
                }
                try {
                    await axios.post("/user/cmmt/" + key, { cmmt });
                    getUser();
                } catch (err) {
                    console.error(err);
                }
            });
            userDiv.appendChild(span1);
            userDiv.appendChild(edit);
            userDiv.appendChild(remove);
            userDiv.appendChild(cmmtBtn);
            for (let i = 0; i < Array.from(span2).length; i++) {
                userDiv.appendChild(span2[i]);
            }
            list.appendChild(userDiv);
            console.log(res.data);
        });
    } catch (err) {
        console.error(err);
    }
}

window.onload = getUser; // 화면 로딩 시 getUser 호출
// 폼 제출(submit) 시 실행
document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    if (!name) {
        return alert("이름을 입력하세요");
    }
    try {
        await axios.post("/user", { name });
        getUser();
    } catch (err) {
        console.error(err);
    }
    e.target.username.value = "";
});
