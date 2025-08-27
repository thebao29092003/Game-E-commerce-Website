const onChange = (e, funcUseState) => {
  // tên sự kiện
  const name = e.target.name;
  // giá trị của sự kiện
  const value = e.target.value;

  // 📌 Vì sao cần dấu []?
  // Vì nếu bạn viết name: value thì name sẽ là string "name", chứ không phải giá trị của biến name.
  funcUseState((pre) => ({
    ...pre,
    [name]: value,
  }));
};

const vertifyPassword = (password) => {
  // regexPassword: Minimum eight characters, at least one uppercase letter,
  // one lowercase letter and one number:
  let regexPassword = new RegExp(
    /((?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$)/
  );
  return regexPassword.test(password)
};

const vertifyRePassword = (password, rePassword) => {
 return password == rePassword
};

function vertifyPhone(number) {
   let regexPassword = new RegExp(
    /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
  );
  return regexPassword.test(number);
}

export default {
  onChange,
  vertifyPassword,
  vertifyRePassword,
  vertifyPhone
};
