import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubscribeNewsletter } from "../../../hook/useSubscribeNewsletter";
import { toast } from "react-hot-toast";
import Container from "../../../style/component/ui/Container";
import styles from "./newsletter.module.css";
import { newsletterSchema } from "../../../schema/newsletterSchema";
import type { z } from "zod";
import { Loader } from "lucide-react";


type FormData = z.infer<typeof newsletterSchema>;

const Newsletter: React.FC = () => {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const { mutate, isPending } = useSubscribeNewsletter();

  const onSubmit = (data: FormData) => {
    mutate(data.email, {
      onSuccess: (res) => {
        toast.success(res.message || "Subscribed successfully!");
        resetField("email");
      },
      onError: (err) => {
        toast.error((err as Error).message);

      },
    });
  };

  // const onSubmit = {data: FormData} => {
  //   mutate(data.email, {
  //     onSuccess: (res) => {
  //       toast.success(res.message || "Subscribed successfully!");
  //       resetField("email");
  //     },
  //     onError: (err) => {
  //       toast.error((err as Error).message);
  //     },
  //   } );
  // };

  return (
    <div className={styles.newsletter}>
      <Container>
        <h3>Stay Updated</h3>
        <p>
          Subscribe to our newsletter and be the first to know about new
          products, exclusive deals, and special offers.
        </p>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <input
            className={styles.newsmail}
            type="email"
            placeholder="Enter your email"
            aria-invalid={!!errors.email}
            {...register("email")}
            disabled={isPending}
          />
          {errors.email && (
            <p className={styles.error} id="email-error">
              {errors.email.message}
            </p>
          )}

          <button
            type="submit"
            className={styles.newsbutton}
            disabled={isPending}
           >
            {isPending ? (
              <>
                Subscribing...
                <Loader
                  size={18}
                  className={styles.loaderIcon}
                  strokeWidth={2}
                />
              </>
            ) : (
              "Subscribe"
            )}
          </button>

        </form>
      </Container>
    </div>
  );
};

export default Newsletter;
