export const generatePassword = (name: string, phone: string) => {
    const stringPass = name.split(" ").join("").slice(0, 4).toLowerCase();
    const strPhone = String(phone);
    const lastFourString = strPhone?.slice(strPhone.length - 4, strPhone.length);
    const newpassword = `${stringPass}@${lastFourString}`

    return newpassword;
}