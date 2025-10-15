
// export const signup = async (req: Request, res: Response) => {
//     const { email, password, role } = req.body;

//     try {
//         const existingUser = await User.query().findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const verificationToken = crypto.randomBytes(32).toString("hex");

//         const user: IUser = await User.query().insert({
//             email,
//             password: hashedPassword,
//             role: role || "user",
//             is_verified: false,
//             verification_token: verificationToken,
//         });

//         // Generate a verification link (frontend route)
//         const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;

//         res.status(201).json({
//             message: "Signup successful!",
//             verificationLink, // return the clickable link
//             user: { id: user.id, email: user.email, role: user.role },
//         });
//     } catch (err) {
//         console.error("Signup Error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// export const signup = async (req: Request, res: Response) => {
//     const { email, password, role } = req.body;

//     try {
//         const existingUser = await User.query().findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already exists" });
//         }
//         const hasedpassword = await bcrypt.hash(password, 10);

//         const verificationToken = crypto.randomBytes(32).toString("hex");

//         const user: Iuser = await User.query().insert({
//             email,
//             password: hashedPassword,
//             role: role || "user",
//             is_verified: false,
//             verification_token: verificationToken,
//         });

//         const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;

//         res.status(201).json({
//             message: "signup successful!",
//             verificationLink,
//             user: { id: user.id, email: user.email, role: user.role },
//         });

//     } catch (err) {
//         console.error("Signup Error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// export const verifyEmail = async (req: Request, res: Response) => {
//     const { token } = req.query;

//     if (!token || typeof token !== "string") {
//         return res.status(400).json({ message: "Invalid token" });
//     }

//     try {
//         const user = await User.query().findOne({ verification_token: token });
//         if (!user) return res.status(400).json({ message: "Invalid token" });

//         await User.query()
//             .findById(user.id)
//             .patch({ is_verified: true, verification_token: undefined });

//         res.json({ message: "Email verified successfully! You can now login." });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// export const verifyEmail = async (req: Request, res: Response) => {
//     const { token } = req.query;

//     if (!token || typeof token !== "string") {
//         return res.status(400).json({ message: "Invalid token " });
//     }

//     try {
//         const user = await User.query().findOne({ verification_token: token });
//         if (!user) return res.status(400).json({ message: " Invalid token " });

//         await User.query()
//             .findById(user.Id)
//             .patch({ is_verified: true, verification_token: undefined });

//         res.json({ message: "Email verified successfully! You can login." })
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: " Server error" });
//     }
// };

// export const verifyEmail = async (req: Request, res: Response) => {
//     const { token } = req.query;

//     if (!token || typeof token !== "String") {
//         return res.status(400).json({ message: "Invalid token " });
//     }

//     try {
//         const user = await User.query().findOne({ verification_token: token });
//         if (!user) return res.status(400).json({ message: "Invalid token " });

//         await User.query()
//             .findById(user.Id)
//             .patch({ is_verified: true, verification_token: undefined });

//         res.json({ message: "Email verified successfully ! you can login." })
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: " server error" });
//     }
// };