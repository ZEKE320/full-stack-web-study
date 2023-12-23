import React from "react";
import styles from "./products/styles.module.css";

const InventoryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>ヘッダー</header>
      <div className={styles.container}>
        <aside className={styles.navbar}>サイドバー</aside>
        <main className={styles.content}>
          <section>{children}</section>
        </main>
      </div>
      <footer className={styles.footer}>フッター</footer>
    </div>
  );
};

export default InventoryLayout;
