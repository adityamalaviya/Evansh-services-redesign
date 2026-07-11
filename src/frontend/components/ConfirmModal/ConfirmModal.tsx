"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Warning, SignOut, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const typeConfig = {
    danger: {
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700 shadow-red-200",
    },
    warning: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      buttonBg: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
    },
    info: {
      bg: "bg-teal-50",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      buttonBg: "bg-[#14B8A6] hover:bg-[#0F766E] shadow-teal-200",
    },
  };

  const config = typeConfig[type];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header/Banner Style */}
            <div className={`h-2 ${config.iconColor} ${config.iconBg.replace('100', '500')}`} />
            
            <div className="p-8">
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-2xl ${config.iconBg} ${config.iconColor} flex-shrink-0`}>
                  {type === "danger" || type === "warning" ? (
                    <Warning size={32} weight="fill" />
                  ) : (
                    <SignOut size={32} weight="fill" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-900 leading-none">
                      {title}
                    </h3>
                    <button 
                      onClick={onClose}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                    >
                      <X size={20} weight="bold" />
                    </button>
                  </div>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-6 py-3.5 rounded-2xl text-white font-bold text-sm transition-all active:scale-95 shadow-lg ${config.buttonBg}`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmModal;
